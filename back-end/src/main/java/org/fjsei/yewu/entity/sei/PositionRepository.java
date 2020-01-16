package org.fjsei.yewu.entity.sei;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface PositionRepository extends JpaRepository<Position, Long>, JpaSpecificationExecutor<Position> {


    Position findByAddress(String address);

}

