package com.moqa.system.service;

import com.moqa.system.model.Dispositivo;
import com.moqa.system.model.LogEvento;
import com.moqa.system.repository.DispositivoRepository;
import com.moqa.system.repository.LogEventoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DispositivoService {

    private final DispositivoRepository dispositivoRepository;
    private final LogEventoRepository logEventoRepository;

    @Transactional
    public Dispositivo salvarDispositivo(Dispositivo dispositivo) {
        return dispositivoRepository.save(dispositivo);
    }

    public List<Dispositivo> listarTodos() {
        return dispositivoRepository.findAll();
    }

    @Transactional
    public LogEvento adicionarLog(Long dispositivoId, LogEvento log) {
        Dispositivo disp = dispositivoRepository.findById(dispositivoId)
                .orElseThrow(() -> new RuntimeException("Dispositivo não encontrado"));
        
        log.setDispositivo(disp);
        return logEventoRepository.save(log);
    }
}