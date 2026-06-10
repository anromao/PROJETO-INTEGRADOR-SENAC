drop database dbFonoaudiologia;
create database dbFonoaudiologia;
use dbFonoaudiologia;

create table tbUsuarios(
codUsu int not null auto_increment,
nome varchar(100) not null,
cpf char(15) not null unique,
telCel varchar(10) not null,
email varchar(100) not null unique,
primary key(codUsu)
);

create table tbPacientes(
codPac int not null auto_increment,
nome varchar(100) not null,
codUsu int not null,
primary key(codPac),
foreign key(codUsu) references tbUsuarios(codUsu)
);

create table tbAgendamentos(
codAgen int not null auto_increment,
data date not null,
horario time not null,
codPac int not null,
primary key(codAgen),
foreign key(codPac) references tbPacientes(codPac)
);