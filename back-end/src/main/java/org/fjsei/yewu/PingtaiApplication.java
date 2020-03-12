package org.fjsei.yewu;

import graphql.ExceptionWhileDataFetching;
import graphql.GraphQLError;
import graphql.servlet.GraphQLErrorHandler;

import org.fjsei.yewu.entity.sei.User;
import org.fjsei.yewu.entity.sei.UserRepository;
import org.fjsei.yewu.exception.GraphQLErrorAdapter;

import org.fjsei.yewu.model.Author;
import org.fjsei.yewu.model.Book;
import org.fjsei.yewu.property.FileStorageProperties;
import org.fjsei.yewu.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.fjsei.yewu.repository.AuthorRepository;

import org.fjsei.yewu.resolver.Mutation;
import org.fjsei.yewu.resolver.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;


//冲突已定义具有相同简名的类型
/*
主程序、启动类
平台后端。
相当于API网关。
集成ehcache二级缓存 https://blog.csdn.net/yiduyangyi/article/details/54176453
*/

//@CrossOrigin(origins = {"http://localhost:7789", "null"})
//这里的:7789设置没有用到=无效，要在配置文件application.yml里面设置。
//@EnableCaching		用法不同的机制。



@EnableTransactionManagement
@SpringBootApplication
@EnableConfigurationProperties({
		FileStorageProperties.class
})
public class PingtaiApplication {
	/*
	public static void main(String[] args){

		new SpringApplicationBuilder()
				.sources(PingtaiApplication.class)
				.run(args);

	}
	*/

	public static void main(String[] args)
	{
		SpringApplication.run(PingtaiApplication.class, args);
	}

	//jpa懒加载报异常：session失效,配置文件中加jpa.properties.open-in-view: true;
	@Bean
	public OpenEntityManagerInViewFilter openEntityManagerInViewFilter() {
		return new OpenEntityManagerInViewFilter();
	}




    @PersistenceContext(unitName = "entityManagerFactorySei")
    private EntityManager emSei;

	/*
	启动后的可执行的定制任务类。Override  run();
	用@Order 注解来定义执行顺序。
		*/
	@Bean
    @Transactional
	public CommandLineRunner demo(AuthorRepository authorRepository, BookRepository bookRepository) {
            if(!emSei.isJoinedToTransaction())      emSei.joinTransaction();
	    return (args) -> {
			Author author = new Author("Herbert", "Schildt");
		};
	}

}


//安全控制核心在：org/fjsei/yewu/config/MyGraphQLWebAutoConfiguration.java ，没有jwt认证，就无法访问后端资源。
//数据库H2没有启动时，可能无法启动本服务器。
//hibernate-ehcache不支持3代的，所以出现告警WARN  org.hibernate.orm.deprecation - HHH020100:  新版本ehcache3不能用,要配套ehcache2；
//注入配置参数对象的模式@EnableConfigurationProperties， 否则启动时找不到bean；
//SpringBoot-2.1.1使用https 需要  https://www.cnblogs.com/yvanchen1992/p/10111534.html
