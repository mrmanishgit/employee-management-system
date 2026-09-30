package com.company.ems.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.company.ems.entity.AppUser;
import com.company.ems.entity.Role;
import com.company.ems.repository.UserRepository;

@Configuration
public class AdminInitializer {

	@Bean
	CommandLineRunner createAdmin(UserRepository repository, PasswordEncoder encoder,
			@Value("${app.admin.email}") String email, @Value("${app.admin.password}") String password) {

		return args -> {

			if (!repository.existsByEmail(email)) {

				AppUser admin = new AppUser();
				admin.setEmail(email);
				admin.setPassword(encoder.encode(password));
				admin.setRole(Role.ADMIN);

				repository.save(admin);

				System.out.println("Initial admin account created.");
			}
		};
	}
}