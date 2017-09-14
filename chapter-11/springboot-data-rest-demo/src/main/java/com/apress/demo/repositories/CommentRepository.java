package com.apress.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apress.demo.entities.Comment;

/**
 * @author Siva
 * 
 */
public interface CommentRepository extends JpaRepository<Comment, Integer>
{

}
