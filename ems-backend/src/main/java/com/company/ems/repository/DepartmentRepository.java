package com.company.ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.ems.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

	boolean existsByNameIgnoreCase(String name);
}