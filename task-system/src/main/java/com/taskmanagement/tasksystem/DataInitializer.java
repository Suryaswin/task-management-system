package com.taskmanagement.tasksystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin") == null) {
            User admin = new User("admin", passwordEncoder.encode("admin123"), "ADMIN");
            userRepository.save(admin);
            System.out.println("Default admin user created: admin/admin123");
        }
        // Removed user1 creation
    }
}