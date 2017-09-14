package com.apress.demo

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.{GetMapping}

@Controller
class HomeController
{
  @Autowired
  var repo: UserRepository = _

  @GetMapping(Array("/"))
  def home(model: Model) : String = {
    model.addAttribute("users", repo.findAll())
    "home"
  }
}
