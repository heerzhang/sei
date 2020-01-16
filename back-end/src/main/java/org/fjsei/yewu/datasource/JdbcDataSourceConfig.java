package org.fjsei.yewu.datasource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

/**
 * @program: spring-boot-example
 * @description: 底层的Jdbc数据源配置类;这个也必须配置，否则错误非常隐蔽与深处。
 * @author:
 * @create: 2018-05-03 14:35
 **/

@Configuration
public class JdbcDataSourceConfig {

    @Primary
    @Bean(name = "dataSourcePropertiesSei")
    @Qualifier("dataSourcePropertiesSei")
    @ConfigurationProperties(prefix="app.datasource.sei")
    public DataSourceProperties dataSourcePropertiesSei() {
        return new DataSourceProperties();
    }

    @Primary
    @Bean(name = "seiDataSource")
    @Qualifier("seiDataSource")
    @ConfigurationProperties(prefix="app.datasource.sei")
    public DataSource seiDataSource(@Qualifier("dataSourcePropertiesSei") DataSourceProperties dataSourceProperties) {
        return dataSourceProperties.initializeDataSourceBuilder().build();
    }

    /*
    每个数据库固定配置一个，对应的table映射的/repository目录也固定。
     */

    @Bean(name = "dataSourcePropertiesSdn")
    @Qualifier("dataSourcePropertiesSdn")
    @ConfigurationProperties(prefix="app.datasource.sdn")
    public DataSourceProperties dataSourcePropertiesSdn() {
        return new DataSourceProperties();
    }

    @Bean(name = "sdnDataSource")
    @Qualifier("sdnDataSource")
    @ConfigurationProperties(prefix="app.datasource.sdn")
    public DataSource sdnDataSource(@Qualifier("dataSourcePropertiesSdn") DataSourceProperties dataSourceProperties) {
        return dataSourceProperties.initializeDataSourceBuilder().build();
    }

    /*
     */

    @Bean(name = "dataSourcePropertiesIncp")
    @Qualifier("dataSourcePropertiesIncp")
    @ConfigurationProperties(prefix="app.datasource.incp")
    public DataSourceProperties dataSourcePropertiesIncp() {
        return new DataSourceProperties();
    }

    @Bean(name = "incpDataSource")
    @Qualifier("incpDataSource")
    @ConfigurationProperties(prefix="app.datasource.incp")
    public DataSource incpDataSource(@Qualifier("dataSourcePropertiesIncp") DataSourceProperties dataSourceProperties) {
        return dataSourceProperties.initializeDataSourceBuilder().build();
    }


    /*
    可能用，使用底层Jdbc情况
    */

    @Bean(name = "seiJdbcTemplate")
    @Qualifier("seiJdbcTemplate")
    public JdbcTemplate seiJdbcTemplate(@Qualifier("seiDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean(name = "sdnJdbcTemplate")
    @Qualifier("sdnJdbcTemplate")
    public JdbcTemplate sdnJdbcTemplate(@Qualifier("sdnDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean(name = "incpJdbcTemplate")
    @Qualifier("incpJdbcTemplate")
    public JdbcTemplate incpJdbcTemplate(@Qualifier("incpDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

}


