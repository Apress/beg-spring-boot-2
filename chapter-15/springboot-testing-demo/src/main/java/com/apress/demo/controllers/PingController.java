package com.apress.demo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Siva
 *
 */
@RestController
public class PingController
{
	@RequestMapping("/ping")
	public String ping()
	{
		return "OK";
	}
}
