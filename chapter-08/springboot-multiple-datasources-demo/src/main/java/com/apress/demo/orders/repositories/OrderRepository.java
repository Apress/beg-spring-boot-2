/**
 * 
 */
package com.apress.demo.orders.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apress.demo.orders.entities.Order;

/**
 * @author Siva
 *
 */
public interface OrderRepository extends JpaRepository<Order, Integer>{

}
