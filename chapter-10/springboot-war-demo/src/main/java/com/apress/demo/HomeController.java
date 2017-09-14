package com.apress.demo;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author Siva
 *
 */
@Controller
public class HomeController
{
	@RequestMapping("/")
	public String index(Model model)
	{
		model.addAttribute("title", "SpringBoot WAR Packaging Demo");
		model.addAttribute("content", "SpringBoot application using JSP Views");
		return "index.jsp";
	}
}
