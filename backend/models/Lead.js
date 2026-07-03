import mongoose from 'mongoose';

/**
 * Mongoose schema definition for CRM opportunity leads.
 * Links to owner users and tracks pipeline stages.
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
      maxlength: [100, 'Contact name cannot exceed 100 characters']
    },
    /**
     * Organization or enterprise company name.
     * @type {String}
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    /**
     * Contact email address for the lead.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        },
        message: props => `${props.value} is not a valid email address`
      }
    },
    /**
     * Contact telephone number.
     * @type {String}
     */
    phone: {
      type: String,
      trim: true
    },
    /**
     * Sales pipeline stage status.
     * @type {String}
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: '{VALUE} is not a valid lead status'
      },
      default: 'New'
    },
    /**
     * Acquisition channel source.
     * @type {String}
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: '{VALUE} is not a valid acquisition source'
      },
      default: 'Website'
    },
    /**
     * Additional notes, details, or context about the lead.
     * @type {String}
     */
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    /**
     * Reference to the User account owning/managing the lead.
     * @type {mongoose.Schema.Types.ObjectId}
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner reference is required']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for fast lookups and sorted pipeline filtering
LeadSchema.index({ owner: 1, status: 1 });
LeadSchema.index({ email: 1 });

/**
 * Virtual property calculating lead age in days.
 * Useful for pipeline stagnation analysis.
 * @returns {Number} Days elapsed since lead creation
 */
LeadSchema.virtual('age').get(function () {
  if (!this.createdAt) {
    return 0;
  }
  const diffMs = Date.now() - this.createdAt.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
});

// Export the schema separately for reuse/nesting
export { LeadSchema };

// Export the model as the default export
const Lead = mongoose.model('Lead', LeadSchema);
export default Lead;
