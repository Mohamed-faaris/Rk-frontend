import DNS from '../models/DNS.js';

// Create new DNS record
export const createDNS = async (req, res) => {
  try {
    const { domain, registrar, dnsProvider, nameservers, records, hosting, managedBy, clientEmail } = req.body;

    // Validate domain format
    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ message: 'Valid domain name is required' });
    }

    // Check if domain already exists
    const existingDNS = await DNS.findOne({ domain: domain.toLowerCase() });
    if (existingDNS) {
      return res.status(409).json({ message: 'Domain already registered in system' });
    }

    const newDNS = new DNS({
      domain: domain.toLowerCase(),
      registrar: registrar || {},
      dnsProvider: dnsProvider || 'Registrar Default',
      nameservers: nameservers || [],
      records: records || [],
      hosting: hosting || {},
      managedBy: managedBy || req.userId,
      clientEmail: clientEmail || ''
    });

    const savedDNS = await newDNS.save();
    res.status(201).json({
      success: true,
      message: 'DNS configuration created successfully',
      data: savedDNS
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating DNS configuration',
      error: error.message
    });
  }
};

// Get all DNS records
export const getAllDNS = async (req, res) => {
  try {
    const { status, dnsProvider, limit = 10, page = 1 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (dnsProvider) query.dnsProvider = dnsProvider;

    const skip = (page - 1) * limit;
    
    const dnsList = await DNS.find(query)
      .populate('managedBy', 'name email')
      .populate('associatedOrder', 'service title')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await DNS.countDocuments(query);

    res.status(200).json({
      success: true,
      data: dnsList,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching DNS records',
      error: error.message
    });
  }
};

// Get DNS by domain
export const getDNSByDomain = async (req, res) => {
  try {
    const { domain } = req.params;

    const dnsRecord = await DNS.findOne({ domain: domain.toLowerCase() })
      .populate('managedBy', 'name email')
      .populate('associatedOrder', 'service title budget');

    if (!dnsRecord) {
      return res.status(404).json({
        success: false,
        message: 'DNS record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dnsRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching DNS record',
      error: error.message
    });
  }
};

// Update DNS configuration
export const updateDNS = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const dnsRecord = await DNS.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('managedBy', 'name email');

    if (!dnsRecord) {
      return res.status(404).json({
        success: false,
        message: 'DNS record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'DNS configuration updated successfully',
      data: dnsRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating DNS configuration',
      error: error.message
    });
  }
};

// Add DNS record
export const addDNSRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const recordData = req.body;

    const dnsRecord = await DNS.findById(id);
    if (!dnsRecord) {
      return res.status(404).json({
        success: false,
        message: 'DNS configuration not found'
      });
    }

    await dnsRecord.addRecord(recordData);

    res.status(201).json({
      success: true,
      message: 'DNS record added successfully',
      data: dnsRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding DNS record',
      error: error.message
    });
  }
};

// Update DNS record
export const updateDNSRecord = async (req, res) => {
  try {
    const { id, recordId } = req.params;
    const updateData = req.body;

    const dnsRecord = await DNS.findById(id);
    if (!dnsRecord) {
      return res.status(404).json({
        success: false,
        message: 'DNS configuration not found'
      });
    }

    await dnsRecord.updateRecord(recordId, updateData);

    res.status(200).json({
      success: true,
      message: 'DNS record updated successfully',
      data: dnsRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating DNS record',
      error: error.message
    });
  }
};

// Delete DNS record
export const deleteDNSRecord = async (req, res) => {
  try {
    const { id, recordId } = req.params;

    const dnsRecord = await DNS.findById(id);
    if (!dnsRecord) {
      return res.status(404).json({
        success: false,
        message: 'DNS configuration not found'
      });
    }

    await dnsRecord.deleteRecord(recordId);

    res.status(200).json({
      success: true,
      message: 'DNS record deleted successfully',
      data: dnsRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting DNS record',
      error: error.message
    });
  }
};

// Delete entire DNS configuration
export const deleteDNS = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await DNS.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'DNS record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'DNS configuration deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting DNS configuration',
      error: error.message
    });
  }
};

// Check domain status
export const checkDomainStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const dnsRecord = await DNS.findById(id);
    if (!dnsRecord) {
      return res.status(404).json({
        success: false,
        message: 'DNS record not found'
      });
    }

    await dnsRecord.checkDomainStatus();

    res.status(200).json({
      success: true,
      message: 'Domain status checked successfully',
      data: {
        domain: dnsRecord.domain,
        status: dnsRecord.status,
        monitoring: dnsRecord.monitoring
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking domain status',
      error: error.message
    });
  }
};

// Get expiring domains
export const getExpiringDomains = async (req, res) => {
  try {
    const { daysWindow = 30 } = req.query;

    const expiringDomains = await DNS.findExpiring(parseInt(daysWindow))
      .populate('managedBy', 'name email')
      .sort({ 'registrar.expirationDate': 1 });

    res.status(200).json({
      success: true,
      message: `Domains expiring within ${daysWindow} days`,
      data: expiringDomains,
      count: expiringDomains.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expiring domains',
      error: error.message
    });
  }
};

// Get domain health report
export const getDomainHealthReport = async (req, res) => {
  try {
    const allDomains = await DNS.find().select('domain status monitoring ssl registrar');
    
    const healthReport = {
      totalDomains: allDomains.length,
      activeDomains: allDomains.filter(d => d.status === 'active').length,
      inactiveDomains: allDomains.filter(d => d.status === 'inactive').length,
      expiredDomains: allDomains.filter(d => d.status === 'expired').length,
      sslEnabled: allDomains.filter(d => d.ssl.enabled).length,
      averageUptime: (allDomains.reduce((sum, d) => sum + (d.monitoring.uptime?.percentage || 0), 0) / allDomains.length).toFixed(2),
      domainDetails: allDomains.map(d => ({
        domain: d.domain,
        status: d.status,
        uptime: d.monitoring.uptime?.percentage || 'N/A',
        sslStatus: d.ssl.enabled ? 'Enabled' : 'Disabled',
        lastChecked: d.monitoring.lastChecked
      }))
    };

    res.status(200).json({
      success: true,
      data: healthReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating health report',
      error: error.message
    });
  }
};
