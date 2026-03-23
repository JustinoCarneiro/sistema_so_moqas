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

    @Transactional
    public void remover(Long id) {
        Dispositivo disp = dispositivoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispositivo com ID " + id + " não encontrado."));
        dispositivoRepository.delete(disp);
    }

    public List<LogEvento> listarLogs(Long dispositivoId) {
        dispositivoRepository.findById(dispositivoId)
                .orElseThrow(() -> new RuntimeException("Dispositivo não encontrado"));
        return logEventoRepository.findByDispositivoId(dispositivoId);
    }

    @Transactional
    public Dispositivo atualizar(Long id, Dispositivo dados) {
        Dispositivo disp = dispositivoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispositivo com ID " + id + " não encontrado."));

        disp.setZona(dados.getZona());
        disp.setLatitude(dados.getLatitude());
        disp.setLongitude(dados.getLongitude());
        disp.setBairro(dados.getBairro());
        disp.setReferencia(dados.getReferencia());
        disp.setLocalizadorGoogle(dados.getLocalizadorGoogle());

        return dispositivoRepository.save(disp);
    }
}