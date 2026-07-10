import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Mongoose schema definition for User accounts.
 * Governs authentication credentials and RBAC roles.
 */
const UserSchema = new mongoose.Schema(
  {
    /**
     * User's full name.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    /**
     * User's unique email address.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Email must be a valid email address',
      },
    },
    /**
     * User's hashed security credentials.
     * @type {String}
     */
    password: {
      type: String,
      required: [
        function () {
          return !this.googleId;
        },
        'Password is required',
      ],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    /**
     * User's authorization role.
     * @type {String}
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not a valid role. Allowed roles: admin, user',
      },
      default: 'user',
    },
    /**
     * Indicates whether the user account is active.
     * @type {Boolean}
     */
    isActive: {
      type: Boolean,
      default: true,
    },
    googleId: {
      type: String,
      default: null,
    },
    picture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Auto-generates and manages createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Pre-save Mongoose hook to encrypt password using bcryptjs before storage.
 */
UserSchema.pre('save', async function () {
  // Only hash password if it exists and was modified (or is new)
  if (!this.password || !this.isModified('password')) {
    return;
  }

  // Check if already hashed to prevent double hashing
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares plain text password with database stored hashed password.
 * 
 * @param {String} candidatePassword - Plain text password input
 * @returns {Promise<Boolean>} True if matches, false otherwise
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Override standard serialization to strip password field from outgoing JSON models.
 * 
 * @returns {Object} User document without the password field
 */
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Export the schema separately for nesting or extension
export { UserSchema };

// Export the model as the default export
const User = mongoose.model('User', UserSchema);
export default User;
