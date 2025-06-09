create table tb_fcm_token (
    user_id bigint not null,
    token varchar(255),
    primary key (user_id)
) engine = InnoDB;

create table tb_notification (
    created_at datetime(6),
    id bigint not null auto_increment,
    receiver_id bigint,
    sender_id bigint,
    message varchar(255),
    title varchar(255),
    primary key (id)
) engine = InnoDB;

INSERT INTO
    tb_notification (
        id,
        title,
        sender_id,
        receiver_id,
        message,
        created_at,
        accepted,
        status
    )
VALUES (
        1,
        'Nova mensagem',
        1,
        3,
        'Olá Maria, como vai?',
        '2024-06-27 10:00:00',
        true,
        0
    );

INSERT INTO
    tb_notification (
        id,
        title,
        sender_id,
        receiver_id,
        message,
        created_at,
        accepted,
        status
    )
VALUES (
        2,
        'Atualização de status',
        2,
        1,
        'João aceitou sua solicitação de conexão.',
        '2024-06-27 11:00:00',
        false,
        1
    );
