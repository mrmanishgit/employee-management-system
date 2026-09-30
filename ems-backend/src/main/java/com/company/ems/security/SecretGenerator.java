package com.company.ems.security;

import java.security.SecureRandom;
import java.util.Base64;

public class SecretGenerator {

    public static void main(String[] args) {

        byte[] secret = new byte[32];

        new SecureRandom().nextBytes(secret);

        System.out.println(
                Base64.getEncoder().encodeToString(secret)
        );
    }
}