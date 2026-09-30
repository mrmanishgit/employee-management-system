package com.company.ems.service;

import java.util.List;

import com.company.ems.entity.Department;

public interface DepartmentService {

	List<Department> getAll();

	Department getById(Long id);

	Department create(Department department);

	Department update(Long id, Department input);

	void delete(Long id);
}
