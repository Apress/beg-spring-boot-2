/**
 * 
 */
package com.apress.demo.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.apress.demo.models.GitHubUser;
import com.apress.demo.services.GitHubService;
import com.apress.demo.services.LoginService;

/**
 * @author Siva
 *
 */
@Controller
public class HomeController {

	@Autowired
	LoginService loginService;
	
	@Autowired
	GitHubService gitHubService;
	
	@GetMapping("/")
	public String index() {
		
		return "index";
	}
	
	@GetMapping("/userInfo")
	public String userInfo(@RequestParam String username, Model model) {
		GitHubUser gitHubUser = gitHubService.getUserInfo(username);
		model.addAttribute("githubUser", gitHubUser);
		return "index";
	}
	
	@PostMapping("/login")
	public String login(HttpServletRequest req, HttpServletResponse res, RedirectAttributes redirectAttributes)
	{
		String email = req.getParameter("email");
		String password = req.getParameter("password");
		boolean loginSuccess = loginService.login(email, password);
		if(loginSuccess){
			redirectAttributes.addFlashAttribute("status", "Login Successful");
		} else {
			redirectAttributes.addFlashAttribute("status", "Login Failed");
		}
		return "redirect:/";
	}
	
}
