package com.moqa.system.controller;

import com.moqa.system.model.Dispositivo;
import com.moqa.system.model.LogEvento;
import com.moqa.system.service.DispositivoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispositivos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permite acesso do Angular
public class DispositivoController {

    private final DispositivoService dispositivoService;

    @GetMapping
    public List<Dispositivo> listar() {
        return dispositivoService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Dispositivo> criar(@Valid @RequestBody Dispositivo dispositivo) {
        return ResponseEntity.ok(dispositivoService.salvarDispositivo(dispositivo));
    }

    @PostMapping("/{id}/logs")
    public ResponseEntity<LogEvento> adicionarLog(
            @PathVariable Long id, 
            @Valid @RequestBody LogEvento log) {
        return ResponseEntity.ok(dispositivoService.adicionarLog(id, log));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        dispositivoService.remover(id);
        return ResponseEntity.noContent().build(); // Retorna HTTP 204 No Content
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<LogEvento>> listarLogs(@PathVariable Long id) {
        return ResponseEntity.ok(dispositivoService.listarLogs(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dispositivo> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Dispositivo dados) {
        return ResponseEntity.ok(dispositivoService.atualizar(id, dados));
    }
}