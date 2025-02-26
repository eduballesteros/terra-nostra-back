package com.terra_nostra.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {

    @GetMapping("/terra-nostra")
    public String home() {
        return "index";
    }
    
    @GetMapping("/shop")
    public ModelAndView mostrarTienda() {
    	return new  ModelAndView("shop");
    }
}
