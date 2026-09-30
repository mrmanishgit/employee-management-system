package com.company.ems.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.company.ems.entity.Department;
import com.company.ems.entity.Employee;
import com.company.ems.exception.DuplicateResourceException;
import com.company.ems.exception.ResourceNotFoundException;
import com.company.ems.repository.DepartmentRepository;
import com.company.ems.repository.EmployeeRepository;
import com.company.ems.service.EmployeeService;

@Service
public class EmployeeServiceImpl implements EmployeeService {

	private final EmployeeRepository employeeRepository;
	private final DepartmentRepository departmentRepository;

	public EmployeeServiceImpl(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {

		this.employeeRepository = employeeRepository;
		this.departmentRepository = departmentRepository;
	}

	@Override
	public List<Employee> getAll() {
		return employeeRepository.findAll();
	}

	@Override
	public Employee getById(Long id) {

		return employeeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
	}

	@Override
	public Employee create(Employee employee) {

		if (employeeRepository.existsByEmailIgnoreCase(employee.getEmail())) {

			throw new DuplicateResourceException("Email already exists: " + employee.getEmail());
		}

		if (employee.getDepartment() != null) {

			Long departmentId = employee.getDepartment().getId();

			Department department = departmentRepository.findById(departmentId)
					.orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));

			employee.setDepartment(department);
		}

		return employeeRepository.save(employee);
	}

	@Override
	public Employee update(Long id, Employee input) {

		Employee employee = getById(id);

		/*
		 * Check email only when the email is changed.
		 */
		if (!employee.getEmail().equalsIgnoreCase(input.getEmail())
				&& employeeRepository.existsByEmailIgnoreCase(input.getEmail())) {

			throw new DuplicateResourceException("Email already exists: " + input.getEmail());
		}

		employee.setFirstName(input.getFirstName());
		employee.setLastName(input.getLastName());
		employee.setEmail(input.getEmail());
		employee.setPhone(input.getPhone());
		employee.setDesignation(input.getDesignation());
		employee.setSalary(input.getSalary());
		employee.setJoiningDate(input.getJoiningDate());

		if (input.getDepartment() != null) {

			Long departmentId = input.getDepartment().getId();

			Department department = departmentRepository.findById(departmentId)
					.orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));

			employee.setDepartment(department);

		} else {

			employee.setDepartment(null);
		}

		return employeeRepository.save(employee);
	}

	@Override
	public void delete(Long id) {

		Employee employee = getById(id);

		employeeRepository.delete(employee);
	}
}