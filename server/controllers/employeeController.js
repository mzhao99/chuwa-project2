const Employee = require('../models/EmployeeModel');

// 获取employee
const getEmployees = async (req, res) => {
  try {
    // const {
    //   orderBy = 'createdAt',
    //   order = 'asc',
    //   page = 1,
    //   limit = 10,
    //   searchStr,
    // } = req.query;

    // const filter = searchStr ? {name: {$regex: searchStr, $options: 'i'}} : {};

    // const sort = {[orderBy]: order === 'asc' ? 1 : -1};

    // const Employees = await Employee.find(filter)
    //   .sort(sort)
    //   .skip((page - 1) * limit)
    //   .limit(parseInt(limit));

    // const totalItems = await Employee.countDocuments(filter);
    // const totalPages = Math.ceil(totalItems / limit);

    const Employees = await Employee.find();
    res.json({
      Employees,
      // pagination: {
      //   page: parseInt(page),
      //   limit: parseInt(limit),
      //   totalPages,
      //   totalItems,
      // },
    });
  } catch (err) {
    res
      .status(500)
      .json({error: 'Internal Server Error', details: err.message});
  }
};

// 添加employee
const addEmployee = async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(400).json({error: 'Not admin'});
  }
  try {
    const Employee = new Employee(req.body);
    await Employee.save();
    res.json({message: 'Employee added successfully', Employee});
  } catch (err) {
    res
      .status(500)
      .json({error: 'Failed to add Employee', details: err.message});
  }
};

// 更新employee
const updateEmployee = async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(401).json({error: 'Not admin'});
  }
  try {
    const Employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!Employee) {
      return res.status(404).json({error: 'Employee not found'});
    }
    res.json({message: 'Employee updated successfully', Employee});
  } catch (err) {
    res
      .status(500)
      .json({error: 'Failed to update Employee', details: err.message});
  }
};

// 删除员工
const deleteEmployee = async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(400).json({error: 'Not admin'});
  }
  try {
    const Employee = await Employee.findByIdAndDelete(req.params.id);
    if (!Employee) {
      return res.status(404).json({error: 'Employee not found'});
    }
    res.json({message: 'Employee deleted successfully'});
  } catch (err) {
    res
      .status(500)
      .json({error: 'Failed to delete Employee', details: err.message});
  }
};

module.exports = {getEmployees, addEmployee, updateEmployee, deleteEmployee};
