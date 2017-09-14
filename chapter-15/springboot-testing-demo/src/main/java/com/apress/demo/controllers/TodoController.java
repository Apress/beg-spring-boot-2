/**
 * 
 */
package com.apress.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.apress.demo.repositories.TodoRepository;

@Controller
public class TodoController {

	@Autowired
	TodoRepository todoRepository;
	
	@GetMapping("/todolist")
	public String showTodos(Model model)
	{
		model.addAttribute("todos", todoRepository.findAll());
		return "todos";
	}
	
}
