
const prisma = require("../lib/prisma");
const cloudinary = require("../lib/cloudinary");
const streamifier = require("streamifier");

// Enviar imagem para o Cloudinary
function uploadImageToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "cordas-ufc/posts",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
}

function createSlug(title) {
    return title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function parseEventDate(value) {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;

    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error("DATA_INVALIDA");
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        throw new Error("DATA_INVALIDA");
    }

    return date;
}

// Listar publicações publicadas
async function getPosts(req, res) {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
        });

        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro ao buscar publicações.",
        });
    }
}

// Buscar publicação pelo slug
async function getPostBySlug(req, res) {
    try {
        const post = await prisma.post.findFirst({
            where: {
                slug: req.params.slug,
                published: true,
            },
        });

        if (!post) {
            return res.status(404).json({
                error: "Publicação não encontrada.",
            });
        }

        return res.json(post);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro ao buscar publicação.",
        });
    }
}

// Cadastrar publicação
async function createPost(req, res) {
    try {
        const {
            title,
            excerpt,
            content,
            coverImage,
            published,
            eventDate,
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                error: "Título e conteúdo são obrigatórios.",
            });
        }

        let parsedEventDate;

        try {
            parsedEventDate = parseEventDate(eventDate);
        } catch {
            return res.status(400).json({
                error: "Data do acontecimento inválida.",
            });
        }

        // Upload da imagem, caso tenha sido enviada
        let imageUrl = coverImage || null;

        if (req.file) {
            imageUrl = await uploadImageToCloudinary(req.file);
        }

        const baseSlug = createSlug(title) || "publicacao";
        let slug = baseSlug;
        let counter = 1;

        while (await prisma.post.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter++}`;
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                excerpt: excerpt || content.slice(0, 180),
                content,
                coverImage: imageUrl,
                published: published === true || published === "true",
                eventDate: parsedEventDate ?? null,
            },
        });

        return res.status(201).json(post);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro ao criar publicação.",
        });
    }
}

// Editar publicação
async function updatePost(req, res) {
    try {
        const {
            title,
            excerpt,
            content,
            coverImage,
            published,
            eventDate,
        } = req.body;

        const currentPost = await prisma.post.findUnique({
            where: { id: req.params.id },
        });

        if (!currentPost) {
            return res.status(404).json({
                error: "Publicação não encontrada.",
            });
        }

        const data = {};

        if (title !== undefined) data.title = title;
        if (excerpt !== undefined) data.excerpt = excerpt;
        if (content !== undefined) data.content = content;
        if (coverImage !== undefined) data.coverImage = coverImage;

        if (published !== undefined) {
            data.published = published === true || published === "true";
        }

        // Atualizar imagem somente se uma nova for enviada
        if (req.file) {
            data.coverImage = await uploadImageToCloudinary(req.file);
        }

        if (eventDate !== undefined) {
            try {
                data.eventDate = parseEventDate(eventDate);
            } catch {
                return res.status(400).json({
                    error: "Data do acontecimento inválida.",
                });
            }
        }

        if (title && title !== currentPost.title) {
            const baseSlug = createSlug(title) || "publicacao";
            let slug = baseSlug;
            let counter = 1;

            while (
                await prisma.post.findFirst({
                    where: {
                        slug,
                        NOT: { id: currentPost.id },
                    },
                })
            ) {
                slug = `${baseSlug}-${counter++}`;
            }

            data.slug = slug;
        }

        const post = await prisma.post.update({
            where: { id: req.params.id },
            data,
        });

        return res.json(post);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro ao atualizar publicação.",
        });
    }
}

// Excluir publicação
async function deletePost(req, res) {
    try {
        await prisma.post.delete({
            where: { id: req.params.id },
        });

        return res.json({
            message: "Publicação excluída com sucesso.",
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                error: "Publicação não encontrada.",
            });
        }

        console.error(error);
        return res.status(500).json({
            error: "Erro ao excluir publicação.",
        });
    }
}

// Listar todas as publicações para o painel
async function getAllPosts(req, res) {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.json(posts);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Erro ao buscar publicações.",
        });
    }
}

// Buscar curtidas
async function getPostLikes(req, res) {
    try {
        const { slug } = req.params;
        const { visitorId } = req.query;

        const post = await prisma.post.findFirst({
            where: { slug, published: true },
            select: { id: true },
        });

        if (!post) {
            return res.status(404).json({
                error: "Novidade não encontrada.",
            });
        }

        const [count, like] = await Promise.all([
            prisma.postLike.count({
                where: { postId: post.id },
            }),

            visitorId
                ? prisma.postLike.findUnique({
                    where: {
                        postId_visitorId: {
                            postId: post.id,
                            visitorId,
                        },
                    },
                })
                : null,
        ]);

        return res.json({
            count,
            liked: Boolean(like),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro ao buscar curtidas.",
        });
    }
}

// Adicionar curtida
async function addPostLike(req, res) {
    try {
        const { slug } = req.params;
        const { visitorId } = req.body;

        if (
            !visitorId ||
            typeof visitorId !== "string" ||
            visitorId.length > 100
        ) {
            return res.status(400).json({
                error: "Identificador de visitante inválido.",
            });
        }

        const post = await prisma.post.findFirst({
            where: { slug, published: true },
            select: { id: true },
        });

        if (!post) {
            return res.status(404).json({
                error: "Novidade não encontrada.",
            });
        }

        await prisma.postLike.upsert({
            where: {
                postId_visitorId: {
                    postId: post.id,
                    visitorId,
                },
            },
            update: {},
            create: {
                postId: post.id,
                visitorId,
            },
        });

        const count = await prisma.postLike.count({
            where: { postId: post.id },
        });

        return res.json({ count, liked: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro ao registrar curtida.",
        });
    }
}

// Remover curtida
async function removePostLike(req, res) {
    try {
        const { slug } = req.params;
        const { visitorId } = req.body;

        if (
            !visitorId ||
            typeof visitorId !== "string" ||
            visitorId.length > 100
        ) {
            return res.status(400).json({
                error: "Identificador de visitante inválido.",
            });
        }

        const post = await prisma.post.findFirst({
            where: { slug, published: true },
            select: { id: true },
        });

        if (!post) {
            return res.status(404).json({
                error: "Novidade não encontrada.",
            });
        }

        await prisma.postLike.deleteMany({
            where: {
                postId: post.id,
                visitorId,
            },
        });

        const count = await prisma.postLike.count({
            where: { postId: post.id },
        });

        return res.json({ count, liked: false });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro ao remover curtida.",
        });
    }
}

module.exports = {
    getPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostLikes,
    addPostLike,
    removePostLike,
};
