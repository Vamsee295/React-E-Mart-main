package com.employee.management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(name = "first_name")
    private String firstName;
    
    @NotBlank
    @Column(name = "last_name")
    private String lastName;
    
    @NotBlank
    @Email
    private String email;
    
    private String phone;
    
    private String position;
    
    private String department;
    
    @Column(name = "hire_date")
    @Temporal(TemporalType.DATE)
    private Date hireDate;
    
    private Double salary;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks = new ArrayList<>();
    
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
} 