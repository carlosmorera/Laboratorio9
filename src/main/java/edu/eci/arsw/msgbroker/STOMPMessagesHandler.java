/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.msgbroker;

import edu.eci.arsw.msgbroker.model.Point;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author carlos
 */
@Controller
@RequestMapping(value="/app")
public class STOMPMessagesHandler {
	
	@Autowired
	SimpMessagingTemplate msgt;
        private int numeroPuntos = 0;
    List<Point> puntosPoligono = new ArrayList<>();

    @MessageMapping("/newpoint")
    public void getLine(Point pt) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:" + pt);
        msgt.convertAndSend("/topic/newpoint", pt);
        puntosPoligono.add(pt);
        numeroPuntos++;
        if (numeroPuntos == 4) {
            msgt.convertAndSend("/topic/newpolygon", puntosPoligono);
            System.out.println("==>4 puntos hechos!");
            numeroPuntos = 0;
            puntosPoligono.clear();
        }
    }
}
