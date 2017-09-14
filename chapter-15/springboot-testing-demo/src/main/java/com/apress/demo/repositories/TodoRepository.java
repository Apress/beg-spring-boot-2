/**
 * 
 */
package com.apress.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RestResource;

import com.apress.demo.entities.Todo;

/**
 * @author Siva
 *
 */
@RestResource(exported=false)
public interface TodoRepository extends JpaRepository<Todo, Integer>{

}
