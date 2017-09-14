package com.apress.demo

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.query.Param

trait UserRepository extends JpaRepository[User, java.lang.Long] {
  def findByEmail(@Param("email") name: String): List[User]
}