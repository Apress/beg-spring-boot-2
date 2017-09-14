/**
 * 
 */
package com.apress.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apress.demo.entities.Message;

/**
 * @author Siva
 *
 */
public interface MessageRepository extends JpaRepository<Message, Integer>{

}
