package com.apress.springbootgroovydemo

import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}