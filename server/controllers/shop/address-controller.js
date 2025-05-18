const Address = require('../../models/Address');

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;

    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({ success: false, message: 'Invalid data provided!' });
    }

    const newlyCreatedAddress = await Address.create({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });

    res.status(201).json({ success: true, data: newlyCreatedAddress });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User id is required!' });
    }

    const addressList = await Address.findAll({ where: { userId } });

    res.status(200).json({ success: true, data: addressList });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({ success: false, message: 'User and address id is required!' });
    }

    const [updatedRowsCount, [updatedAddress]] = await Address.update(formData, {
      where: { id: addressId, userId },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    res.status(200).json({ success: true, data: updatedAddress });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({ success: false, message: 'User and address id is required!' });
    }

    const deletedRowsCount = await Address.destroy({ where: { id: addressId, userId } });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    res.status(200).json({ success: true, message: 'Address deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
