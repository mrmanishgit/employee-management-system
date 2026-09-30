package com.company.ems.serviceImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.company.ems.entity.Department;
import com.company.ems.entity.Employee;
import com.company.ems.exception.DuplicateResourceException;
import com.company.ems.exception.ResourceNotFoundException;
import com.company.ems.repository.DepartmentRepository;
import com.company.ems.repository.EmployeeRepository;
import java.math.BigDecimal;
@ExtendWith(MockitoExtension.class)
class EmployeeServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private Employee employee;
    private Department department;

    @BeforeEach
    void setUp() {

        department = new Department();
        department.setId(1L);
        department.setName("IT");
        department.setDescription("Information Technology");

        employee = new Employee();
        employee.setId(1L);
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setEmail("john@example.com");
        employee.setPhone("9876543210");
        employee.setDesignation("Developer");
        employee.setSalary( new BigDecimal("50000.00"));
        employee.setDepartment(department);
    }

    @Test
    void getAll_ShouldReturnEmployees() {

        List<Employee> employees =
                Arrays.asList(employee);

        when(employeeRepository.findAll())
                .thenReturn(employees);

        List<Employee> result =
                employeeService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(
                "john@example.com",
                result.get(0).getEmail()
        );

        verify(employeeRepository).findAll();
    }

    @Test
    void getById_ShouldReturnEmployee() {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        Employee result =
                employeeService.getById(1L);

        assertNotNull(result);
        assertEquals(
                "John",
                result.getFirstName()
        );
        assertEquals(
                "john@example.com",
                result.getEmail()
        );

        verify(employeeRepository).findById(1L);
    }

    @Test
    void getById_ShouldThrowException_WhenEmployeeNotFound() {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> employeeService.getById(1L)
        );

        verify(employeeRepository).findById(1L);
    }

    @Test
    void create_ShouldSaveEmployee() {

        when(employeeRepository.existsByEmailIgnoreCase(
                employee.getEmail()
        )).thenReturn(false);

        when(departmentRepository.findById(1L))
                .thenReturn(Optional.of(department));

        when(employeeRepository.save(employee))
                .thenReturn(employee);

        Employee result =
                employeeService.create(employee);

        assertNotNull(result);
        assertEquals(
                "john@example.com",
                result.getEmail()
        );

        verify(employeeRepository)
                .existsByEmailIgnoreCase(
                        employee.getEmail()
                );

        verify(departmentRepository)
                .findById(1L);

        verify(employeeRepository)
                .save(employee);
    }

    @Test
    void create_ShouldThrowException_WhenEmailExists() {

        when(employeeRepository.existsByEmailIgnoreCase(
                employee.getEmail()
        )).thenReturn(true);

        assertThrows(
                DuplicateResourceException.class,
                () -> employeeService.create(employee)
        );

        verify(employeeRepository)
                .existsByEmailIgnoreCase(
                        employee.getEmail()
                );
    }

    @Test
    void create_ShouldThrowException_WhenDepartmentNotFound() {

        when(employeeRepository.existsByEmailIgnoreCase(
                employee.getEmail()
        )).thenReturn(false);

        when(departmentRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> employeeService.create(employee)
        );

        verify(departmentRepository)
                .findById(1L);
    }

    @Test
    void update_ShouldUpdateEmployee() {

        Employee input = new Employee();

        input.setFirstName("Mike");
        input.setLastName("Smith");
        input.setEmail("mike@example.com");
        input.setPhone("9999999999");
        input.setDesignation("Senior Developer");
        input.setSalary(new BigDecimal("70000.00"));
        input.setDepartment(department);

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        when(employeeRepository.existsByEmailIgnoreCase(
                input.getEmail()
        )).thenReturn(false);

        when(departmentRepository.findById(1L))
                .thenReturn(Optional.of(department));

        when(employeeRepository.save(employee))
                .thenReturn(employee);

        Employee result =
                employeeService.update(1L, input);

        assertNotNull(result);
        assertEquals(
                "Mike",
                result.getFirstName()
        );
        assertEquals(
                "mike@example.com",
                result.getEmail()
        );
        assertEquals(
                "Senior Developer",
                result.getDesignation()
        );

        verify(employeeRepository)
                .findById(1L);

        verify(employeeRepository)
                .save(employee);
    }

    @Test
    void update_ShouldThrowException_WhenEmployeeNotFound() {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> employeeService.update(
                        1L,
                        employee
                )
        );

        verify(employeeRepository)
                .findById(1L);
    }

    @Test
    void update_ShouldThrowException_WhenEmailAlreadyExists() {

        Employee input = new Employee();

        input.setFirstName("Mike");
        input.setLastName("Smith");
        input.setEmail("existing@example.com");

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        when(employeeRepository.existsByEmailIgnoreCase(
                input.getEmail()
        )).thenReturn(true);

        assertThrows(
                DuplicateResourceException.class,
                () -> employeeService.update(
                        1L,
                        input
                )
        );

        verify(employeeRepository)
                .existsByEmailIgnoreCase(
                        input.getEmail()
                );
    }

    @Test
    void delete_ShouldDeleteEmployee() {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        employeeService.delete(1L);

        verify(employeeRepository)
                .findById(1L);

        verify(employeeRepository)
                .delete(employee);
    }

    @Test
    void delete_ShouldThrowException_WhenEmployeeNotFound() {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> employeeService.delete(1L)
        );

        verify(employeeRepository)
                .findById(1L);
    }
}