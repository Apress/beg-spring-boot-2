package com.apress.springbootgroovydemo

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping

@Controller
class HomeController {

    @Autowired
    UserRepository repo;

    @GetMapping("/")
    String home(Model model) {
        model.addAttribute("users", repo.findAll())
        "home"
    }
}
