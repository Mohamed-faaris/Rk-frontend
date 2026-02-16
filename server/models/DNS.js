import mongoose from 'mongoose';
import { promises as dnsPromises } from 'dns';

const dnsSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: [true, 'Domain name is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/, 'Please provide a valid domain name']
  },
  
  // Domain Registrar Info
  registrar: {
    name: {
      type: String,
      enum: ['GoDaddy', 'Namecheap', 'Cloudflare', 'Route53', 'Google Domains', 'Other'],
      default: 'Other'
    },
    registrarId: {
      type: String,
      trim: true
    },
    registrationDate: Date,
    expirationDate: {
      type: Date,
      required: false
    },
    autoRenew: {
      type: Boolean,
      default: true
    }
  },

  // DNS Provider Info
  dnsProvider: {
    type: String,
    enum: ['Cloudflare', 'Route53', 'Google Cloud DNS', 'Azure DNS', 'DigitalOcean', 'Registrar Default', 'Other'],
    default: 'Registrar Default'
  },

  // Nameservers
  nameservers: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    ipv4: String,
    ipv6: String
  }],

  // DNS Records
  records: [{
    type: {
      type: String,
      enum: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'SOA'],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    ttl: {
      type: Number,
      default: 3600
    },
    priority: Number,
    weight: Number,
    port: Number,
    target: String,
    active: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Hosting/Server Info
  hosting: {
    provider: {
      type: String,
      enum: ['Vercel', 'Netlify', 'Railway', 'Render', 'Heroku', 'AWS', 'DigitalOcean', 'Azure', 'Other'],
      default: 'Other'
    },
    serverIP: String,
    serverLocation: String,
    cdnEnabled: {
      type: Boolean,
      default: false
    },
    cdnProvider: String,
    sslCertificate: {
      provider: String,
      issuer: String,
      expirationDate: Date,
      autoRenew: {
        type: Boolean,
        default: true
      }
    }
  },

  // SSL/TLS Settings
  ssl: {
    enabled: {
      type: Boolean,
      default: true
    },
    certificateType: {
      type: String,
      enum: ['DV', 'OV', 'EV'],
      default: 'DV'
    },
    issuer: String,
    validFrom: Date,
    validUntil: Date,
    autoRenew: {
      type: Boolean,
      default: true
    }
  },

  // Domain Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended', 'expired'],
    default: 'pending'
  },

  // Health Monitoring
  monitoring: {
    enabled: {
      type: Boolean,
      default: true
    },
    checkInterval: {
      type: Number,
      default: 3600
    },
    lastChecked: Date,
    dnsResolution: {
      status: String,
      resolvedIPs: [String],
      lastResolved: Date
    },
    sslStatus: {
      status: String,
      lastChecked: Date
    },
    uptime: {
      percentage: {
        type: Number,
        default: 100
      },
      lastUpdated: Date
    }
  },

  // Associated Project/Order
  associatedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },

  associatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },

  // Admin/Manager
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Client Info
  clientEmail: {
    type: String,
    trim: true,
    lowercase: true
  },

  // Notes and Documentation
  notes: {
    type: String,
    trim: true
  },

  // Configuration Backup
  backupConfig: {
    enabled: {
      type: Boolean,
      default: true
    },
    lastBackup: Date,
    backupLocation: String
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
dnsSchema.index({ status: 1 });
dnsSchema.index({ managedBy: 1 });
dnsSchema.index({ associatedOrder: 1 });

// Pre-save middleware to update lastUpdated
dnsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for domain expiration warning
dnsSchema.virtual('expirationWarning').get(function() {
  if (!this.registrar.expirationDate) return null;
  const daysUntilExpiry = Math.ceil((this.registrar.expirationDate - Date.now()) / (1000 * 60 * 60 * 24));
  return {
    daysRemaining: daysUntilExpiry,
    isWarning: daysUntilExpiry < 30,
    isCritical: daysUntilExpiry < 7
  };
});

// Virtual for SSL expiration warning
dnsSchema.virtual('sslExpirationWarning').get(function() {
  if (!this.ssl.validUntil) return null;
  const daysUntilExpiry = Math.ceil((this.ssl.validUntil - Date.now()) / (1000 * 60 * 60 * 24));
  return {
    daysRemaining: daysUntilExpiry,
    isWarning: daysUntilExpiry < 30,
    isCritical: daysUntilExpiry < 7
  };
});

// Method to add DNS record
dnsSchema.methods.addRecord = function(recordData) {
  this.records.push(recordData);
  return this.save();
};

// Method to update DNS record
dnsSchema.methods.updateRecord = function(recordId, updateData) {
  const record = this.records.id(recordId);
  if (!record) throw new Error('Record not found');
  Object.assign(record, updateData);
  return this.save();
};

// Method to delete DNS record
dnsSchema.methods.deleteRecord = function(recordId) {
  this.records.id(recordId).deleteOne();
  return this.save();
};

// Method to check domain status
dnsSchema.methods.checkDomainStatus = async function() {
  try {
    const resolvedIPs = await dnsPromises.resolve4(this.domain);
    
    this.monitoring.lastChecked = Date.now();
    this.monitoring.dnsResolution = {
      status: 'resolved',
      resolvedIPs,
      lastResolved: Date.now()
    };
    
    if (this.status === 'pending' || this.status === 'inactive') {
      this.status = 'active';
    }
    
    return await this.save();
  } catch (error) {
    this.monitoring.lastChecked = Date.now();
    this.monitoring.dnsResolution = {
      status: 'failed',
      error: error.message,
      lastResolved: Date.now()
    };
    this.status = 'inactive';
    return await this.save();
  }
};

// Static method to find active domains
dnsSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find expiring domains
dnsSchema.statics.findExpiring = function(daysWindow = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysWindow);
  
  return this.find({
    'registrar.expirationDate': {
      $lt: futureDate,
      $gt: new Date()
    }
  });
};

const DNS = mongoose.model('DNS', dnsSchema);

export default DNS;
