package com.reaction.ices4hu.core.entities.users;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
@DiscriminatorValue("Administrator")
public class Administrator extends User {

    @Column(name = "adminId")
    private Long adminId;

}
