const User = require("../models/User.model");
const AuditLog = require("../models/AuditLog.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d"
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, studentId, department, year } = req.body;

    // Validate required fields
    if (!name || !email || !password || !studentId || !department || !year) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, password, studentId, department, year) are required"
      });
    }

    // Validate input formats
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    if (!/^[A-Z0-9]+$/.test(studentId.trim())) {
      return res.status(400).json({
        success: false,
        message: "Student ID must contain only uppercase letters and numbers"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? "Email already registered" 
          : "Student ID already registered"
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      studentId,
      department,
      year,
      role: "member",
      status: "Active"
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Log the registration
    await AuditLog.log({
      userId: user._id,
      action: "register",
      resource: "User",
      resourceId: user._id,
      resourceName: user.name,
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Check for user
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check if account is locked BEFORE checking password
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: "Account is locked due to too many failed login attempts. Please try again later or contact support.",
        lockUntil: user.lockUntil
      });
    }

    // Check if account is active
    if (user.status !== "Active") {
      await AuditLog.log({
        userId: user._id,
        action: "login",
        resource: "User",
        resourceId: user._id,
        resourceName: user.name,
        status: "failure",
        errorMessage: `Account is ${user.status}`,
        ipAddress: req.ip,
        userAgent: req.get("user-agent")
      });

      return res.status(403).json({
        success: false,
        message: `Your account is ${user.status.toLowerCase()}. Please contact an administrator.`
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      await AuditLog.log({
        userId: user._id,
        action: "login",
        resource: "User",
        resourceId: user._id,
        resourceName: user.name,
        status: "failure",
        errorMessage: "Invalid password",
        ipAddress: req.ip,
        userAgent: req.get("user-agent")
      });
      
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login and last activity
    user.lastLogin = Date.now();
    user.lastActivity = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Log the successful login
    await AuditLog.log({
      userId: user._id,
      action: "login",
      resource: "User",
      resourceId: user._id,
      resourceName: user.name,
      status: "success",
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        role: user.role,
        status: user.status,
        token
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again later."
    });
  }
};

// @desc    Logout user / Clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Log the logout
    await AuditLog.log({
      userId: req.user.id,
      action: "logout",
      resource: "User",
      resourceId: req.user.id,
      resourceName: req.user.name,
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user data"
    });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      bio: req.body.bio,
      profileImage: req.body.profileImage
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    // Validate name if provided
    if (fieldsToUpdate.name) {
      if (fieldsToUpdate.name.trim().length < 2 || fieldsToUpdate.name.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 100 characters"
        });
      }
      fieldsToUpdate.name = fieldsToUpdate.name.trim();
    }

    // Validate phone if provided
    if (fieldsToUpdate.phone && !/^[0-9]{10}$/.test(fieldsToUpdate.phone.replace(/\D/g, ''))) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits"
      });
    }

    // Validate bio length
    if (fieldsToUpdate.bio && fieldsToUpdate.bio.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Bio cannot exceed 500 characters"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    // Log the update
    await AuditLog.log({
      userId: req.user.id,
      action: "update",
      resource: "User",
      resourceId: user._id,
      resourceName: user.name,
      changes: {
        fields: Object.keys(fieldsToUpdate)
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });

    res.status(200).json({
      success: true,
      message: "Details updated successfully",
      data: user
    });
  } catch (error) {
    console.error("Update details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update details"
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required"
      });
    }

    // Validate password strength (min 8 chars, at least one number and one special char)
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long"
      });
    }

    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least one number"
      });
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password"
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      await AuditLog.log({
        userId: req.user.id,
        action: "update",
        resource: "User",
        resourceId: user._id,
        resourceName: user.name,
        status: "failure",
        errorMessage: "Invalid current password during password change",
        ipAddress: req.ip,
        userAgent: req.get("user-agent")
      });

      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Update password and track change
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    // Log the password change
    await AuditLog.log({
      userId: req.user.id,
      action: "update",
      resource: "User",
      resourceId: user._id,
      resourceName: user.name,
      changes: {
        fields: ["password"]
      },
      status: "success",
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });

    // Generate new token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Password updated successfully. Please login again with your new password.",
      token
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating password"
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal that user doesn't exist for security
      return res.status(200).json({
        success: true,
        message: "If an account exists, a reset email will be sent"
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // TODO: Send email with reset token
    // const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Password Reset Token',
    //   message: `You are receiving this email because you requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`
    // });

    // Log the forgot password request
    await AuditLog.log({
      userId: user._id,
      action: "update",
      resource: "User",
      resourceId: user._id,
      resourceName: user.name,
      changes: {
        fields: ["passwordResetToken", "passwordResetExpires"]
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });

    // For development, return the token
    res.status(200).json({
      success: true,
      message: "Password reset email sent",
      data: { resetToken } // Remove this in production
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process forgot password request"
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log the password reset
    await AuditLog.log({
      userId: user._id,
      action: "update",
      resource: "User",
      resourceId: user._id,
      resourceName: user.name,
      changes: {
        fields: ["password"]
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
      token
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password"
    });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verifyemail/:verificationtoken
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    // Get hashed token
    const verificationToken = crypto
      .createHash("sha256")
      .update(req.params.verificationtoken)
      .digest("hex");

    const user = await User.findOne({
      verificationToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token"
      });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Log the email verification
    await AuditLog.log({
      userId: user._id,
      action: "verify",
      resource: "User",
      resourceId: user._id,
      resourceName: user.name,
      changes: {
        after: { emailVerified: true }
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify email"
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resendverification
// @access  Private
exports.resendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified"
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // TODO: Send verification email
    // const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verifyemail/${verificationToken}`;
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Email Verification',
    //   message: `Please verify your email by clicking the link: \n\n ${verifyUrl}`
    // });

    // Log the resend verification request
    await AuditLog.log({
      userId: user._id,
      action: "update",
      resource: "User",
      resourceId: user._id,
      resourceName: user.name,
      changes: {
        fields: ["verificationToken", "verificationTokenExpires"]
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });

    res.status(200).json({
      success: true,
      message: "Verification email sent",
      data: { verificationToken } // Remove this in production
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email"
    });
  }
};
