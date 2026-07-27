package com.saphire.aocs.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DelayLogId implements Serializable {

    @Column(name = "flight_id")
    private Long flightId;

    @Column(name = "delay_seq_no")
    private Integer delaySeqNo;
}
