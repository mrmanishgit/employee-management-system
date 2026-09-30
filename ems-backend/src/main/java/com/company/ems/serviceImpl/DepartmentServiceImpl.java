package com.company.ems.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.company.ems.entity.Department;
import com.company.ems.exception.DuplicateResourceException;
import com.company.ems.exception.ResourceNotFoundException;
import com.company.ems.repository.DepartmentRepository;
import com.company.ems.service.DepartmentService;

@Service
public class DepartmentServiceImpl implements DepartmentService {

	private final DepartmentRepository repository;

	public DepartmentServiceImpl(DepartmentRepository repository) {
		this.repository = repository;
	}

	@Override
	public List<Department> getAll() {
		return repository.findAll();
	}

	@Override
	public Department getById(Long id) {

		return repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Department with id " + id + " not found"));
	}

	@Override
	public Department create(Department department) {

		if (repository.existsByNameIgnoreCase(department.getName())) {

			throw new DuplicateResourceException("Department already exists: " + department.getName());
		}

		return repository.save(department);
	}

	@Override
	public Department update(Long id, Department input) {

		Department department = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Department with id " + id + " not found"));

		if (!department.getName().equalsIgnoreCase(input.getName())
				&& repository.existsByNameIgnoreCase(input.getName())) {

			throw new DuplicateResourceException("Department already exists: " + input.getName());
		}

		department.setName(input.getName());
		department.setDescription(input.getDescription());

		return repository.save(department);
	}

	@Override
	public void delete(Long id) {

		Department department = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Department with id " + id + " not found"));

		repository.delete(department);
	}
}