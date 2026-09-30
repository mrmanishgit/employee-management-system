package com.company.ems.service;

import com.company.ems.dto.AuthResponse;
import com.company.ems.dto.LoginRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);

}