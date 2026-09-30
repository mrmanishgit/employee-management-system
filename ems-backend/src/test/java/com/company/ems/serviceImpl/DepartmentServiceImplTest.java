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
import com.company.ems.exception.DuplicateResourceException;
import com.company.ems.exception.ResourceNotFoundException;
import com.company.ems.repository.DepartmentRepository;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceImplTest {

    @Mock
    private DepartmentRepository repository;

    @InjectMocks
    private DepartmentServiceImpl departmentService;

    private Department department;

    @BeforeEach
    void setUp() {

        department = new Department();

        department.setId(1L);
        department.setName("IT");
        department.setDescription(
                "Information Technology"
        );
    }

    @Test
    void getAll_ShouldReturnDepartments() {

        List<Department> departments =
                Arrays.asList(department);

        when(repository.findAll())
                .thenReturn(departments);

        List<Department> result =
                departmentService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(
                "IT",
                result.get(0).getName()
        );

        verify(repository).findAll();
    }

    @Test
    void getById_ShouldReturnDepartment() {

        when(repository.findById(1L))
                .thenReturn(Optional.of(department));

        Department result =
                departmentService.getById(1L);

        assertNotNull(result);
        assertEquals(
                "IT",
                result.getName()
        );

        verify(repository).findById(1L);
    }

    @Test
    void getById_ShouldThrowException_WhenNotFound() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> departmentService.getById(1L)
        );

        verify(repository).findById(1L);
    }

    @Test
    void create_ShouldSaveDepartment() {

        when(repository.existsByNameIgnoreCase(
                department.getName()
        )).thenReturn(false);

        when(repository.save(department))
                .thenReturn(department);

        Department result =
                departmentService.create(department);

        assertNotNull(result);
        assertEquals(
                "IT",
                result.getName()
        );

        verify(repository)
                .existsByNameIgnoreCase(
                        department.getName()
                );

        verify(repository)
                .save(department);
    }

    @Test
    void create_ShouldThrowException_WhenNameExists() {

        when(repository.existsByNameIgnoreCase(
                department.getName()
        )).thenReturn(true);

        assertThrows(
                DuplicateResourceException.class,
                () -> departmentService.create(department)
        );

        verify(repository)
                .existsByNameIgnoreCase(
                        department.getName()
                );
    }

    @Test
    void update_ShouldUpdateDepartment() {

        Department input = new Department();

        input.setName("Human Resources");
        input.setDescription(
                "Human Resources Department"
        );

        when(repository.findById(1L))
                .thenReturn(Optional.of(department));

        when(repository.existsByNameIgnoreCase(
                input.getName()
        )).thenReturn(false);

        when(repository.save(department))
                .thenReturn(department);

        Department result =
                departmentService.update(1L, input);

        assertNotNull(result);
        assertEquals(
                "Human Resources",
                result.getName()
        );
        assertEquals(
                "Human Resources Department",
                result.getDescription()
        );

        verify(repository)
                .findById(1L);

        verify(repository)
                .save(department);
    }

    @Test
    void update_ShouldThrowException_WhenNotFound() {

        Department input = new Department();

        input.setName("HR");
        input.setDescription("Human Resources");

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> departmentService.update(
                        1L,
                        input
                )
        );

        verify(repository)
                .findById(1L);
    }

    @Test
    void update_ShouldThrowException_WhenNameExists() {

        Department input = new Department();

        input.setName("Finance");
        input.setDescription("Finance Department");

        when(repository.findById(1L))
                .thenReturn(Optional.of(department));

        when(repository.existsByNameIgnoreCase(
                input.getName()
        )).thenReturn(true);

        assertThrows(
                DuplicateResourceException.class,
                () -> departmentService.update(
                        1L,
                        input
                )
        );

        verify(repository)
                .existsByNameIgnoreCase(
                        input.getName()
                );
    }

    @Test
    void delete_ShouldDeleteDepartment() {

        when(repository.findById(1L))
                .thenReturn(Optional.of(department));

        departmentService.delete(1L);

        verify(repository)
                .findById(1L);

        verify(repository)
                .delete(department);
    }

    @Test
    void delete_ShouldThrowException_WhenNotFound() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> departmentService.delete(1L)
        );

        verify(repository)
                .findById(1L);
    }
}