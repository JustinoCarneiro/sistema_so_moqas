package com.moqa.system.repository;

import com.moqa.system.model.LogEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LogEventoRepository extends JpaRepository<LogEvento, Long> {
    // Busca todos os logs de um dispositivo específico
    List<LogEvento> findByDispositivoId(Long dispositivoId);
}