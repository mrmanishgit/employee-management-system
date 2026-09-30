package com.company.ems.service;

import java.util.List;

import com.company.ems.entity.Employee;

public interface EmployeeService {

	List<Employee> getAll();

	Employee getById(Long id);

	Employee create(Employee employee);

	Employee update(Long id, Employee input);

	void delete(Long id);
}