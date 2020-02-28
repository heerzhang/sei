package org.fjsei.yewu.entity.sei.oldsys;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DictEqpTypeRepository extends JpaRepository<DictEqpType, Long>, JpaSpecificationExecutor<DictEqpType> {
    DictEqpType  findByIdCodEquals(String cod);
}