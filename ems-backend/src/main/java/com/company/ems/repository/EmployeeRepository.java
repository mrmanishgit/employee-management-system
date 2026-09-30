package com.company.ems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.ems.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	boolean existsByEmailIgnoreCase(String email);

	List<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}