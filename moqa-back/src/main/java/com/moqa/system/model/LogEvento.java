package com.moqa.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "logs_eventos")
@Data
public class LogEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private LocalDateTime data = LocalDateTime.now(); // Data automática ao criar

    @NotBlank(message = "O local do evento é obrigatório")
    private String local;

    @NotBlank(message = "A descrição do evento é obrigatória")
    private String descricao;

    private String observacoes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispositivo_id", nullable = false)
    private Dispositivo dispositivo;
}