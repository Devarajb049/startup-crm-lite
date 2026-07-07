import mongoose from 'mongoose';

/**
 * Mongoose schema definition for CRM opportunity leads.
 * Tracks client contact information, status stages, and refers to owner user.
 */
const LeadSchema = new mongoose.Schema(
  {
    /**
     * Contact person's full name.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      minlength: [2, 'Contact name must be at least 2 characters long'],
      maxlength: [100, 'Contact name cannot exceed 100 characters'],
    },
    /**
     * Company or organization name the lead belongs to.
     * @type {String}
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    /**
     * Lead contact email address.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Email must be a valid email address',
      },
    },
    /**
     * Optional telephone contact number.
     * @type {String}
     */
    phone: {
      type: String,
      trim: true,
    },
    /**
     * Estimated opportunity deal size value.
     * @type {Number}
     */
    value: {
      type: Number,
      default: 0,
    },
    /**
     * Sales pipeline stage status.
     * @type {String}
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
        message: '{VALUE} is not a valid lead status',
      },
      default: 'New',
    },
    /**
     * Customer acquisition channel source.
     * @type {String}
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Facebook', 'Instagram', 'Google Ads', 'Other'],
        message: '{VALUE} is not a valid lead source',
      },
      default: 'Website',
    },
    /**
     * Optional text notes or details about the client opportunity.
     * @type {String}
     */
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    /**
     * Reference to the User account owning/managing this lead.
     * @type {mongoose.Schema.Types.ObjectId}
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner reference is required'],
    },
  },
  {
    timestamps: true, // Auto-generates and manages createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index on owner and status for fast filtered queries
LeadSchema.index({ owner: 1, status: 1 });

// Index on email for fast lookups
LeadSchema.index({ email: 1 });

// Index on owner and name for quick name lookup
LeadSchema.index({ owner: 1, name: 1 });

// Index on owner and company for quick company search
LeadSchema.index({ owner: 1, company: 1 });

// Index on owner and source for filtered sources
LeadSchema.index({ owner: 1, source: 1 });

// Index on owner and createdAt for date-range pagination and filtering
LeadSchema.index({ owner: 1, createdAt: -1 });


/**
 * Virtual property calculating lead age in days since it was created.
 * @returns {Number} Days elapsed since lead creation
 */
LeadSchema.virtual('age').get(function () {
  if (!this.createdAt) {
    return 0;
  }
  const diffMs = Date.now() - this.createdAt.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
});

/**
 * Virtual property formatting the creation date as YYYY-MM-DD.
 * @returns {String} Creation date formatted as YYYY-MM-DD
 */
LeadSchema.virtual('date').get(function () {
  if (!this.createdAt) {
    return '';
  }
  return this.createdAt.toISOString().split('T')[0];
});

// Export the schema separately for nesting or extension
export { LeadSchema };

// Export the model as the default export
const Lead = mongoose.model('Lead', LeadSchema);
export default Lead;
