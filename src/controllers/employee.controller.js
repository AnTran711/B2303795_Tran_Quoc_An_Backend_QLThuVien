import Employee from '../models/employee.model.js';
import ApiError from '../api_error.js';

class EmployeeController {
  // [POST] /api/employees
  async create(req, res, next) {
    try {
      const employee = new Employee(req.body);
      await employee.save();
      return res.send({ message: 'Created an employee successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while creating a employee'));
    }
  }

  // [GET] /api/employees
  async findAll(req, res, next) {
    try {
      const employees = await Employee.find().lean();
      return res.send(employees);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving employees'));
    }
  }

  // [GET] /api/employees/:employeeId
  async findOne(req, res, next) {
    try {
      const employee = await Employee.findOne({ MSNV: req.params.employeeId }).lean();
      return res.send(employee);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving employees'));
    }
  }

  // [PUT] /api/employees/:employeeId
  async update(req, res, next) {
    try {
      await Employee.updateOne({ MSNV: req.params.employeeId }, req.body);
      return res.send({ message: 'An employee was updated successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while updating an employee'));
    }
  }

  // [DELETE] /api/employees
  async deleteAll(req, res, next) {
    try {
      const result = await Employee.deleteMany();
      return res.send({ message: `${result.deletedCount} employees were deleted successfully` });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while removing all employees'));
    }
  }

  // [DELETE] /api/employees/:employeeId
  async delete(req, res, next) {
    try {
      await Employee.deleteOne({ MSNV: req.params.employeeId });
      return res.send({ message: 'An employee was deleted successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while deleting an employee'));
    }
  }
}

export default new EmployeeController();
