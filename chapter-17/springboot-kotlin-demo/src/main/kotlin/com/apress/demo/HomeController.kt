package com.apress.demo


import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping

@Controller
class HomeController(val repository:UserRepository) {

    @GetMapping("/")
    fun home(model: Model): String {
        model.addAttribute("users", repository.findAll())
        return "home"
    }
}