package org.fjsei.yewu.entity.sei.original;

import org.fjsei.yewu.entity.sei.inspect.ISP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

//JPA的核心，数据库装入,到对应的实体类去。

public interface OriginalRecordRepository extends JpaRepository<OriginalRecord, Long>, JpaSpecificationExecutor<OriginalRecord> {

    List<OriginalRecord> findByIsp(ISP isp);


}

