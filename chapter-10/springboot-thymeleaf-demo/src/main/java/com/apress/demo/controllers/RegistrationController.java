
package com.apress.demo.controllers;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.apress.demo.domain.User;
import com.apress.demo.validators.UserValidator;

/**
 * @author Siva
 *
 */
@Controller
public class RegistrationController 
{
	@Autowired
	private UserValidator userValidator;
	
	@RequestMapping(value = "/registration", method = RequestMethod.GET)
	public String registrationForm(Model model) {
		model.addAttribute("user", new User());
		return "registration";
	}
	
	@RequestMapping(value = "/registration", method = RequestMethod.POST)
	public String handleRegistration(@Valid User user, BindingResult result) {
		System.out.println("Registering User : "+user);
		userValidator.validate(user, result);
		if(result.hasErrors()){
			return "registration";
		}
		return "redirect:/login";
	}
}
